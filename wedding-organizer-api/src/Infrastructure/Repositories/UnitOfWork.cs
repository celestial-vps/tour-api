using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Threading.Tasks;
using WeddingOrganizerAPI.Data;

namespace WeddingOrganizerAPI.Repositories
{
    public class UnitOfWork : IDisposable
    {
        private readonly AppDbContext _context;
        private IDbContextTransaction? _transaction;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            if (_transaction != null)
                return _transaction;

            _transaction = await _context.Database.BeginTransactionAsync();
            return _transaction;
        }

        public async Task CommitAsync()
        {
            if (_transaction == null)
                throw new InvalidOperationException("No transaction started.");

            await _context.SaveChangesAsync();
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }

        public async Task RollbackAsync()
        {
            if (_transaction == null)
                return;

            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}
